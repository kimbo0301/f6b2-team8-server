import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { Connection } from 'typeorm';
import { UserModule } from './apis/user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './apis/board/board.module';
import { ImageUploadModule } from './apis/imageUpload/imageUpload.module';
import { CommentModule } from './apis/comment/comment.module';
import { CommentLikeModule } from './apis/commentLike/commentLike.module';
import { BoardLikeModule } from './apis/boardLike/boardLike.module';
import { PointTransactionModule } from './apis/pointTransaction/pointTransaction.module';
import { BoardTagModule } from './apis/boardTag/boardTag.module';
import { MessageModule } from './apis/message/message.module';

@Module({
  imports: [
    AuthModule,
    BoardModule,
    BoardLikeModule,
    BoardTagModule,
    ImageUploadModule,
    UserModule,
    MessageModule,
    CommentModule,
    CommentLikeModule,
    PointTransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors: {
        Credential: true,
        origin: ['http://localhost:3000'],
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my-database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'team_project',
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}

// 이거 배포할때 설정하는것
// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: '10.16.96.3',
//   port: 3306,
//   username: 'root',
//   password: 'root',
//   database: 'team_data',
//   entities: [__dirname + '/apis/**/*.entity.*'],
//   synchronize: true,
//   logging: true,
//   retryAttempts: 30,
//   retryDelay: 5000,
// }),
// CacheModule.register<RedisClientOptions>({
//   store: redisStore,
//   url: 'redis://XkjocNA3@10.140.0.4:6379',
//   isGlobal: true,
// }),

// 이건 로컬 테스트용
// TypeOrmModule.forRoot({
//   type: 'mysql',
//   host: 'my-database',
//   port: 3306,
//   username: 'root',
//   password: 'root',
//   database: 'mainproject',
//   entities: [__dirname + '/apis/**/*.entity.*'],
//   synchronize: true,
//   logging: true,
//   retryAttempts: 30,
//   retryDelay: 5000,
// }),
// CacheModule.register<RedisClientOptions>({
//   store: redisStore,
//   url: 'redis://my-redis:6379',
//   isGlobal: true,
// }),
