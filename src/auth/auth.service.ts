import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto
    const user = this.usersRepository.create({ username, password })
    await this.usersRepository.save(user)
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.createUser(authCredentialsDto)
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto
    const user = await this.usersRepository.findOne({ where: { username } })

    if (user && user.password === password) {
      const payload: JwtPayload = { username }
      const accessToken = await this.jwtService.sign(payload)
      return { accessToken }
    } else {
      throw new UnauthorizedException()
    }
  }
}
