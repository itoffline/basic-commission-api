export class CreateUserDto {
  id: string;
  username: string;
  password: string;
  privilegedCommission: boolean;
}

export default CreateUserDto;
