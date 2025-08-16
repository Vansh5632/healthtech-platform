import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class RoomDto {
  @IsString()
  @IsNotEmpty()
  room: string;
}

export class SignalingDto extends RoomDto {
  @IsObject()
  @IsNotEmpty()
  payload: object;
}
