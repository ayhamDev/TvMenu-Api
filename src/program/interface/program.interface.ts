import { EnterAnimation } from "src/program/interface/enter-animation.interface";
import { LeaveAnimation } from "src/program/interface/leave-animation.interface";
import { IClient } from "src/client/interface/client.interface";
import { IDevice } from "src/device/interface/device.interface";
import { IDates } from "@interface/Dates/Dates.interface";

export interface IProgram extends IDates {
  id: string;

  Devices?: IDevice[];

  Client?: IClient;

  Name: string;

  Description: string;

  LayerNumber: number;

  Type: number;

  WebUrl: string;

  ImageUrl: string;

  VideoUrl: string;

  Status: string;

  X: number;

  Y: number;

  Width: number;

  Height: number;

  Duration: number;

  NextLoop: number;

  EnterAnimation: EnterAnimation;

  LeaveAnimation: LeaveAnimation;

  StartDateTime: string;

  EndDateTime: string;
}
