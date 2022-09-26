import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}
  create(createArticleDto: CreateArticleDto) {
    return this.prisma.user.create({ data: createArticleDto });
  }

  findAll() {
    return this.prisma.article.findMany({ where: { published: true } });
  }

  findAllDrafts() {
    return this.prisma.article.findMany({ where: { published: false } });
  }

  findOne(id: number) {
    // return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
