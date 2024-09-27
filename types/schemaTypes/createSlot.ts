/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Document, Model } from "mongoose";

export interface ITimeSlot extends Document {
      timeId: string,
      organizationName: string,
      email: string,
      image: string,
      description: string,
      amount: number,
      date: string,
      time1: string,
      time2: string,
      time3: string,
      meetlink: string,
      creatorId: string
}

export interface ITimeSlotModel extends Model<ITimeSlot> {}