import { Test } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { getTestingDatabaseConfiguration } from "../database/db_configuration";
import { Genre } from "./genre.entity";
import { Game } from "../games/game.entity";
import { Image } from "../images/image.entity";
import { GamevaultUser } from "../users/gamevault-user.entity";
import { Progress } from "../progress/progress.entity";
import { Publisher } from "../publishers/publisher.entity";
import { Developer } from "../developers/developer.entity";
import { Store } from "../stores/store.entity";
import { Builder } from "builder-pattern";
import { Repository } from "typeorm/repository/Repository";
import { Tag } from "../tags/tag.entity";
import { GenresController } from "./genres.controller";

describe("GenresController", () => {
  let genresController: GenresController;
  let genreRepository: Repository<Genre>;
  let gameRepository: Repository<Game>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(getTestingDatabaseConfiguration()),
        TypeOrmModule.forFeature([
          Tag,
          Game,
          Image,
          GamevaultUser,
          Progress,
          Publisher,
          Store,
          Developer,
          Genre,
        ]),
      ],
      controllers: [GenresController],
    }).compile();

    genresController = moduleRef.get<GenresController>(GenresController);
    genreRepository = moduleRef.get<Repository<Genre>>(
      getRepositoryToken(Genre),
    );
    gameRepository = moduleRef.get<Repository<Game>>(getRepositoryToken(Game));
  });

  afterEach(async () => {
    gameRepository.clear();
    genreRepository.clear();
  });

  it("should be defined", () => {
    expect(genresController).toBeDefined();
    expect(genreRepository).toBeDefined();
    expect(gameRepository).toBeDefined();
  });

  it("should get genre", async () => {
    const testingGenre: Genre = new Genre();
    testingGenre.name = "Action";
    testingGenre.rawg_id = 1337;
    await genreRepository.save(testingGenre);

    const results = await genresController.getGenres();
    expect(results.length).toBe(1);
    expect(results[0].rawg_id).toBe(1337);
    expect(results[0].name).toBe("Action");
  });

  it("should sort genres by the amount of games associated with them", async () => {
    const genre1: Genre = Builder(Genre).name("Racing").rawg_id(1111).build();
    const genre2: Genre = Builder(Genre)
      .name("Platformer")
      .rawg_id(2222)
      .build();
    await genreRepository.save([genre1, genre2]);

    await gameRepository.save(
      Builder(Game)
        .title("Testgame2")
        .file_path("filepath.zip")
        .early_access(false)
        .genres([genre2])
        .build(),
    );

    const results = await genresController.getGenres();
    expect(results.length).toBe(2);
    expect(results[0].rawg_id).toBe(2222);
    expect(results[0].name).toBe("Platformer");
    expect(results[1].rawg_id).toBe(1111);
    expect(results[1].name).toBe("Racing");
  });
});
