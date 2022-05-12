//auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user: Pick<
    User,
    'userEmail' | 'userPhone' | 'userNickname' | 'userSignUpSite'
  >;
}

@Controller('/')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const user = await this.userService.findCheck({
      userEmail: req.user.userEmail,
      userSignUpSite: req.user.userSignUpSite,
    });

    if (user) {
      this.authService.social_login({ user, res });
    } else {
      const newUser = await this.userService.socialCreate({ user: req.user });
      this.authService.social_login({ user: newUser, res });
    }
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    const user = await this.userService.findCheck({
      userEmail: req.user.userEmail,
      userSignUpSite: req.user.userSignUpSite,
    });

    if (user) {
      this.authService.social_login({ user, res });
    } else {
      const newUser = await this.userService.socialCreate({ user: req.user });
      this.authService.social_login({ user: newUser, res });
    }
    // // 계정이 이미 생성된 상태인지 확인
    // const social_user = await this.userService.socialCreate({ user: req.user });
    // // 로그인
    // this.authService.social_login({ user: social_user, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    // 계정이 이미 생성된 상태인지 확인
    const social_user = await this.userService.socialCreate({ user: req.user });
    console.log(social_user);
    // 로그인
    this.authService.social_login({ user: social_user, res });
  }
}
