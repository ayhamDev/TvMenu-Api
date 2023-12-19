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

export class UpdateProgramDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  deviceIds: string[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  layerNumber: number;

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

  @IsNotEmpty()
  @IsIn(["Active", "Suspended"])
  status: string;

  @IsNotEmpty()
  @IsNumberOrPercentage()
  x: string;

  @IsNotEmpty()
  @IsNumberOrPercentage()
  y: string;

  @IsNotEmpty()
  @IsNumberOrPercentage()
  width: string;

  @IsNotEmpty()
  @IsNumberOrPercentage()
  height: string;

  @IsOptional()
  @IsPositive()
  duration: number;

  @IsOptional()
  @IsPositive()
  nextLoop: number;

  @IsNotEmpty()
  @IsIn(EnterAnimationValues)
  enterAnimation: string;

  @IsNotEmpty()
  @IsIn(LeaveAnimationValues)
  leaveAnimation: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  startDateTime: string;

  @IsNotEmpty()
  @IsISO8601({ strict: true })
  endDateTime: string;
}
