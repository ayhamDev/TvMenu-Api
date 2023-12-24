import {
  ArrayNotEmpty,
  IsArray,
  IsISO8601,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { EnterAnimationValues } from "../interface/enter-animation.interface";
import { LeaveAnimationValues } from "../interface/leave-animation.interface";
import { IsNumberOrPercentage } from "../is-number-or-percentage/is-number-or-percentage.decorator";

export class UpdateManyProgramDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsNumber()
  layerNumber: number;

  @IsOptional()
  @IsIn([1, 2, 3])
  type: number;

  @IsOptional()
  @IsString()
  webUrl: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  videoUrl: string;

  @IsOptional()
  @IsIn(["Active", "Suspended"])
  status: string;

  @IsOptional()
  @IsNumberOrPercentage()
  x: string;

  @IsOptional()
  @IsNumberOrPercentage()
  y: string;

  @IsOptional()
  @IsNumberOrPercentage()
  width: string;

  @IsOptional()
  @IsNumberOrPercentage()
  height: string;

  @IsOptional()
  @IsPositive()
  duration: number;

  @IsOptional()
  @IsPositive()
  nextLoop: number;

  @IsOptional()
  @IsIn(EnterAnimationValues)
  enterAnimation: string;

  @IsOptional()
  @IsIn(LeaveAnimationValues)
  leaveAnimation: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  startDateTime: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  endDateTime: string;
}
