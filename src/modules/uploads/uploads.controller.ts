/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiConsumes,
  ApiBody,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma/enums';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 15 * 1024 * 1024; // 15MB

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('access-token')
export class UploadsController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({
    summary:
      'Upload an image (project image, blog cover, avatar, testimonial photo, etc.)',
    description:
      'Admin only. Accepts JPG, PNG, WEBP, SVG — max 5MB. Returns the Cloudinary URL to store in the relevant field.',
  })
  @ApiOkResponse({ type: UploadResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid file type or file too large' })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp|svg\+xml)$/ })
        .addMaxSizeValidator({ maxSize: MAX_IMAGE_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    const result = await this.cloudinaryService.uploadBuffer(file.buffer, {
      folder: 'portfolio/images',
      resourceType: 'image',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      bytes: result.bytes,
      format: result.format,
    };
  }

  // @Post('document')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: { file: { type: 'string', format: 'binary' } },
  //   },
  // })
  // @ApiOperation({
  //   summary: 'Upload a document (PDF, resume/CV, etc.)',
  //   description: 'Admin only. Accepts PDF, DOC, DOCX — max 15MB.',
  // })
  // @ApiOkResponse({ type: UploadResponseDto })
  // @ApiBadRequestResponse({ description: 'Invalid file type or file too large' })
  // @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  // async uploadDocument(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType:
  //           /(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
  //       })
  //       .addMaxSizeValidator({ maxSize: MAX_DOCUMENT_SIZE })
  //       .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
  //   )
  //   file: Express.Multer.File,
  // ): Promise<UploadResponseDto> {
  //   const result = await this.cloudinaryService.uploadBuffer(file.buffer, {
  //     folder: 'portfolio/documents',
  //     resourceType: 'raw',
  //   });

  //   return {
  //     url: result.secure_url,
  //     publicId: result.public_id,
  //     resourceType: result.resource_type,
  //     bytes: result.bytes,
  //     format: result.format,
  //   };
  // }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({
    summary: 'Upload a document (PDF, resume/CV, etc.)',
    description: 'Admin only. Accepts PDF, DOC, DOCX — max 15MB.',
  })
  @ApiOkResponse({ type: UploadResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid file type or file too large' })
  @ApiForbiddenResponse({ description: 'Only ADMIN can perform this action' })
  async uploadDocument(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/,
        })
        .addMaxSizeValidator({ maxSize: MAX_DOCUMENT_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    const isPdf = file.mimetype === 'application/pdf';

    const result = await this.cloudinaryService.uploadBuffer(file.buffer, {
      folder: 'portfolio/documents',
      resourceType: isPdf ? 'image' : 'raw',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      bytes: result.bytes,
      format: result.format,
    };
  }

  @Delete(':publicId')
  @ApiOperation({
    summary: 'Delete an uploaded file from Cloudinary',
    description: 'Admin only.',
  })
  @ApiOkResponse({ description: 'File deleted successfully' })
  async deleteFile(
    @Param('publicId') publicId: string,
    @Query('resourceType') resourceType: 'image' | 'raw' = 'image',
  ) {
    const decodedId = decodeURIComponent(publicId);
    await this.cloudinaryService.deleteFile(decodedId, resourceType);
    return { message: 'File deleted successfully' };
  }
}
