import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlpha,
  IsAlphanumeric,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  MinLength,
} from "class-validator";
import { Role } from "./role.enum";

export class UpdateUserDto {
  @IsAlphanumeric()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: "JohnDoe",
    description: "username of the user",
    nullable: true,
  })
  username?: string;

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: "john.doe@mail.com",
    description: "email of the user",
    nullable: true,
  })
  email?: string;

  @MinLength(8)
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: "SecretPw822!",
    minLength: 8,
    description: "password of the user",
    nullable: true,
  })
  password?: string;

  @IsAlpha("de-DE")
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: "John",
    description: "first name of the user",
    nullable: true,
  })
  first_name?: string;

  @IsAlpha("de-DE")
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    example: "Doe",
    description: "last name of the user",
    nullable: true,
  })
  last_name?: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    pattern: "url",
    example: "https://example.com/profile-picture.png",
    description: "url to the profile picture of the user",
    nullable: true,
  })
  profile_picture_url?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 69_420,
    description: "id of the profile picture of the user",
  })
  profile_picture_id?: number;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    pattern: "url",
    example: "https://example.com/profile-art.png",
    description: "url to the profile art (background-image) of the User",
    nullable: true,
  })
  background_image_url?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 69_420,
    description: "id of the profile art (background-image) of the User",
  })
  background_image_id?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    pattern: "boolean",
    example: true,
    description: "wether or not the user is activated. Not yet working.",
    nullable: true,
  })
  activated?: boolean;

  @IsEnum(Role)
  @IsOptional()
  @ApiProperty({
    type: "enum",
    enum: Role,
    example: Role.EDITOR,
    description:
      "The role determines the set of permissions and access rights for a user in the system.",
  })
  public role?: Role;
}
