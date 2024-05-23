import { Action } from '@app/authorization';
import { GlobalCacheService } from '@app/cache';
import { Exception } from '@app/core/exception';
import { IFormatErrorObject } from '@app/core/filters/http-exeption.filter';
import { IGetProjectInfoCache } from '@app/core/types';
import ProjectIssueCategory from '@app/database-type-orm/entities/task-manager/ProjectIssueCategory';
import ProjectIssueState from '@app/database-type-orm/entities/task-manager/ProjectIssueState';
import ProjectIssueType from '@app/database-type-orm/entities/task-manager/ProjectIssueType';
import ProjectVersion from '@app/database-type-orm/entities/task-manager/ProjectVersion';
import UserProject from '@app/database-type-orm/entities/task-manager/UserProject';
import { Global, HttpException, HttpStatus, Inject, Injectable, LiteralObject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import {
  Environment,
  ErrorCustom,
  MailType,
  ProjectIssueCategoryStatus,
  ProjectIssueStateStatus,
  ProjectIssueTypeStatus,
  ProjectVersionStatus,
  SocketEventKeys,
  TextPriority,
} from 'libs/constants/enum';
import * as format from 'string-format';
import { Between, MoreThan, Repository } from 'typeorm';
interface IProjectIssueHandleById {
  [key: string]: {
    id: number;
    projectId: number;
    order: number;
    isFirst: boolean;
    isLast: boolean;
  };
}

@Global()
@Injectable()
export class UtilsService {
  constructor(private readonly configService: ConfigService) {}

  firstArray(array: any[]) {
    return array[0];
  }
  lastArray(array: any[]) {
    return array[array.length - 1];
  }
  randomOTP(length = 6): string {
    const digits = '0123456789';
    const digitsLength = digits.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * digitsLength);
      result += digits[index];
    }
    return result;
  }
  capitalizeFirstLetterOfEachWord(inputString: string) {
    const words = inputString.split(' ');

    const capitalizedWords = words.map((word) => {
      const firstLetter = word.charAt(0).toUpperCase();
      return firstLetter;
    });
    const capitalizedString = capitalizedWords.join('');
    return capitalizedString;
  }
  hideImportantInformation(data: any, keys: string[]) {
    const result = JSON.parse(JSON.stringify(data));
    keys.forEach((key) => {
      if (result.hasOwnProperty(key)) {
        result[key] = '************************';
      }
    });

    return result;
  }

  assignPaging(params: LiteralObject) {
    params.pageIndex = Number(params.pageIndex) || 1;
    params.pageSize = Number(params.pageSize) || 10;
    params.skip = (params.pageIndex - 1) * params.pageSize;

    return params;
  }

  returnPaging(data: LiteralObject[], totalItems: number, params: LiteralObject, metadata = {}) {
    const totalPages = Math.ceil(totalItems / params.pageSize);
    return {
      paging: true,
      hasMore: params.pageIndex < totalPages,
      pageIndex: params.pageIndex,
      totalPages,
      totalItems,
      data,
      ...metadata,
    };
  }

  randomString(length = 6) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `${result}${this.configService.get<Environment>('nodeEnv', Environment.Development)}`;
  }

  randomStringNoEnv(length = 6) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  randomPassword(length = 6) {
    const charactersNumber = '1234567890';
    const charactersKeyword = 'abcdefghijklmnopqrstuvwxyz';
    const charactersPunctuation = '!@#$%^&*()';
    const characters: string = `${charactersNumber}${charactersKeyword}${charactersKeyword.toLocaleUpperCase()}${charactersPunctuation}`;

    let password: string =
      this.getRandomCharacter(charactersNumber) +
      this.getRandomCharacter(charactersKeyword) +
      this.getRandomCharacter(charactersKeyword.toLocaleUpperCase()) +
      this.getRandomCharacter(charactersPunctuation);

    while (password.length < length) {
      password += this.getRandomCharacter(characters);
    }

    const passwordArray: string[] = password.split('');
    passwordArray.sort(() => Math.random() - 0.5);
    password = passwordArray.join('');

    return `${password}${this.configService.get<Environment>('nodeEnv', Environment.Development)}`;
  }

  getRandomCharacter(characters: string): string {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  assignThumbURL(data: any, key: string, thumb = true) {
    if (!data) return data;
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item && item[key]) this.assignImageURL(item, key, thumb);
      });
    } else {
      if (data[key]) this.assignImageURL(data, key, thumb);
    }

    return data;
  }

  assignThumbURLVer2(data: any, keys: string[], thumb = true) {
    if (!keys.length) return data;
    const lastKey = keys[keys.length - 1];

    if (!data) return data;
    if (Array.isArray(data)) {
      data.forEach((item) => {
        const itemConvert = this.getValueByKeys(item, keys);
        if (itemConvert && itemConvert[lastKey]) {
          this.assignImageURL(itemConvert, lastKey, thumb);
        }
      });
    } else {
      const itemConvert = this.getValueByKeys(data, keys);
      if (itemConvert && itemConvert[lastKey]) {
        this.assignImageURL(itemConvert, lastKey, thumb);
      }
    }

    return data;
  }

  getValueByKeys(data: any, keys: string[]) {
    if (keys.length === 1) {
      return data;
    }

    const currentKey = keys[0];
    const remainingKeys = keys.slice(1);

    if (data && typeof data === 'object' && currentKey in data) {
      return this.getValueByKeys(data[currentKey], remainingKeys);
    }

    return undefined;
  }

  assignImageURL(data, key: string, thumb: boolean) {
    if (data[key].startsWith('http')) {
      data[key] = this.lastArray(data[key].split('/'));
    }

    if (thumb) {
      const thumbs = ['', ...(process.env.AWS_S3_THUMBS || '').split(' ').filter((item) => item)];
      thumbs.forEach((el) => {
        const [w, h] = el.split('x');
        if (w && h) data[key + el] = this.createImageUrl(data[key], Number(w), Number(h));
      });
    }
    if (data[key].endsWith('.mp4')) {
      data['gif'] = this.createGifUrl(data[key]);
    }
    data[key] = this.createImageUrl(data[key]);
    data['origin'] = data[key];
  }

  createImageUrl(img: string, w?: number, h?: number) {
    if (img && !w && !h && !img.startsWith('http'))
      return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${img}`;
    if (img && img != '' && !img.startsWith('http')) {
      return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${String(w)}x${String(h)}/${img}`;
    }

    return img;
  }

  createGifUrl(img: string) {
    if (img && !img.startsWith('http'))
      return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/gif/${this.firstArray(img.split('.'))}.gif`;

    return img;
  }

  omitObject(object: Object, omits: string[]) {
    const objectCopy = this.deepClone(object);

    omits.forEach((key) => {
      delete objectCopy[key];
    });

    return objectCopy;
  }

  pickObject(object: Object, picks: string[]) {
    const objectCopy = this.deepClone(object);

    picks.forEach((key) => {
      if (!picks.includes(key)) delete objectCopy[key];
    });

    return objectCopy;
  }

  deepClone(object: Object) {
    if (typeof object !== 'object' || !object) {
      return object;
    }

    const clonedObject = Array.isArray(object) ? [] : {};

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (object[key] instanceof Date) {
          clonedObject[key] = new Date(object[key]);
        } else {
          clonedObject[key] = this.deepClone(object[key]);
        }
      }
    }

    return clonedObject;
  }

  async handleLogicUpdateOrder(
    projectIssueHandleMainId: number,
    projectIssueHandlePostId: number | undefined,
    projectIssueHandlePreId: number | undefined,
    projectId: number,
    statusUpdate:
      | ProjectIssueTypeStatus
      | ProjectIssueCategoryStatus
      | ProjectIssueStateStatus
      | ProjectVersionStatus
      | undefined,
    statusHandleActive:
      | ProjectIssueTypeStatus
      | ProjectIssueCategoryStatus
      | ProjectIssueStateStatus
      | ProjectVersionStatus,
    handleRepository:
      | Repository<ProjectIssueType>
      | Repository<ProjectIssueCategory>
      | Repository<ProjectIssueState>
      | Repository<ProjectVersion>,
    dataUpdate: any,
  ) {
    const projectIssueHandleIdsFind = [projectIssueHandleMainId];
    if (projectIssueHandlePreId) {
      projectIssueHandleIdsFind.push(projectIssueHandlePreId);
    }
    if (projectIssueHandlePostId) {
      projectIssueHandleIdsFind.push(projectIssueHandlePostId);
    }

    const projectIssueTypes = (await handleRepository
      .createQueryBuilder('h')
      .select(['h.id', 'h.projectId', 'h.order', 'h.isFirst', 'h.isLast'])
      .where('h.projectId = :projectId AND h.status = :statusHandleActive AND h.id IN(:projectIssueHandleIdsFind)', {
        projectId,
        statusHandleActive,
        projectIssueHandleIdsFind: projectIssueHandleIdsFind,
      })
      .getMany()) as any;

    if (projectIssueTypes.length !== projectIssueHandleIdsFind.length) {
      throw new Exception(ErrorCustom.Project_Issue_Handle_Id_Not_Found);
    }

    const projectIssueTypesById = projectIssueTypes.reduce((acc, cur) => {
      acc[cur.id] = cur as any;
      return acc;
    }, {} as IProjectIssueHandleById);

    const projectIssueHandleMainPre = projectIssueTypesById[projectIssueHandlePreId || -1];
    const projectIssueHandleMainPost = projectIssueTypesById[projectIssueHandlePostId || -1];
    const projectIssueHandleMain = projectIssueTypesById[projectIssueHandleMainId];

    const task: (() => void)[] = [];

    if (
      statusUpdate &&
      [
        ProjectIssueTypeStatus.IN_ACTIVE,
        ProjectIssueCategoryStatus.IN_ACTIVE,
        ProjectIssueStateStatus.IN_ACTIVE,
        ProjectVersionStatus.IN_ACTIVE,
      ].includes(statusUpdate)
    ) {
      task.push(() =>
        handleRepository.update(
          { id: projectIssueHandleMain.id },
          { status: statusUpdate as any, order: null, isFirst: false, isLast: false },
        ),
      );

      if (projectIssueHandleMain.isFirst) {
        task.push(() =>
          handleRepository.update({ projectId, order: projectIssueHandleMain.order - 1 }, { isFirst: true }),
        );
      }
      if (projectIssueHandleMain.isLast) {
        task.push(() =>
          handleRepository.update(
            { projectId, order: projectIssueHandleMain.order + 1 },
            { isLast: true, order: () => `order - 1` },
          ),
        );
        task.push(() =>
          handleRepository.update(
            { projectId, order: MoreThan(projectIssueHandleMain.order + 1) },
            { order: () => `order - 1` },
          ),
        );
      }

      await Promise.all(task.map((item) => item()));

      return true;
    }

    if (projectIssueHandleMainPre && projectIssueHandleMainPost) {
      if (projectIssueHandleMainPost.order !== projectIssueHandleMainPre.order + 1) {
        throw new Exception(ErrorCustom.Invalid_Pre_Or_Post_Update);
      }

      /* --------------------------- Drag the item down --------------------------- */
      if (projectIssueHandleMain.order > projectIssueHandleMainPost.order) {
        const mainIsFirst = projectIssueHandleMain.isFirst;
        const mainOrder = projectIssueHandleMain.order;
        const postOrder = projectIssueHandleMainPost.order;

        if (mainIsFirst) {
          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: mainOrder - 1,
              },
              { order: () => `order + 1`, isFirst: true },
            ),
          );

          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: Between(postOrder, mainOrder - 2),
              },
              { order: () => `order + 1` },
            ),
          );
        }

        if (!mainIsFirst) {
          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: Between(postOrder, mainOrder - 1),
              },
              { order: () => `order + 1` },
            ),
          );
        }

        task.push(() =>
          handleRepository.update(
            { id: projectIssueHandleMain.id },
            { order: projectIssueHandleMainPost.order, isFirst: false, ...dataUpdate },
          ),
        );
      }

      /* -------------------------- Drag the item upwards ------------------------- */
      if (projectIssueHandleMain.order < projectIssueHandleMainPre.order) {
        const mainIsLast = projectIssueHandleMain.isLast;
        const mainOrder = projectIssueHandleMain.order;
        const preOrder = projectIssueHandleMainPre.order;

        if (mainIsLast) {
          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: mainOrder + 1,
              },
              { order: () => `order - 1`, isLast: true },
            ),
          );

          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: Between(mainOrder + 2, preOrder),
              },
              { order: () => `order - 1` },
            ),
          );
        }

        if (!mainIsLast) {
          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: Between(mainOrder + 1, preOrder),
              },
              { order: () => `order - 1` },
            ),
          );
        }

        task.push(() =>
          handleRepository.update({ id: projectIssueHandleMain.id }, { order: preOrder, isLast: false, ...dataUpdate }),
        );
      }

      await Promise.all(task.map((item) => item()));

      return true;
    }

    if (projectIssueHandleMainPre) {
      if (!projectIssueHandleMainPre.isFirst) {
        throw new Exception(ErrorCustom.Invalid_Pre_Or_Post_Update);
      }

      const mainIsLast = projectIssueHandleMain.isLast;
      const mainOrder = projectIssueHandleMain.order;
      const preOrder = projectIssueHandleMainPre.order;

      if (mainIsLast) {
        task.push(() =>
          handleRepository.update(
            {
              projectId,
              order: mainOrder + 1,
            },
            { order: () => `order - 1`, isLast: true, isFirst: false },
          ),
        );

        if (mainOrder + 1 !== preOrder) {
          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: Between(mainOrder + 2, preOrder),
              },
              { order: () => `order - 1`, isFirst: false },
            ),
          );
        }
      }

      if (!mainIsLast) {
        task.push(() =>
          handleRepository.update(
            {
              projectId,
              order: Between(mainOrder + 1, preOrder),
            },
            { order: () => `order - 1`, isFirst: false },
          ),
        );
      }

      task.push(() =>
        handleRepository.update(
          { id: projectIssueHandleMain.id },
          { order: preOrder, isFirst: true, isLast: false, ...dataUpdate },
        ),
      );
    }

    if (projectIssueHandleMainPost) {
      if (!projectIssueHandleMainPost.isLast) {
        throw new Exception(ErrorCustom.Invalid_Pre_Or_Post_Update);
      }
      const mainIsFirst = projectIssueHandleMain.isFirst;
      const mainOrder = projectIssueHandleMain.order;
      const postOrder = projectIssueHandleMainPost.order;

      if (mainIsFirst) {
        task.push(() =>
          handleRepository.update(
            {
              projectId,
              order: mainOrder - 1,
            },
            { order: () => `order + 1`, isFirst: true, isLast: false },
          ),
        );

        if (mainOrder - 1 !== postOrder) {
          task.push(() =>
            handleRepository.update(
              {
                projectId,
                order: Between(postOrder, mainOrder - 2),
              },
              { order: () => `order + 1`, isLast: false },
            ),
          );
        }
      }

      if (!mainIsFirst) {
        task.push(() =>
          handleRepository.update(
            {
              projectId,
              order: Between(postOrder, mainOrder - 1),
            },
            { order: () => `order + 1`, isLast: false },
          ),
        );
      }

      task.push(() =>
        handleRepository.update(
          { id: projectIssueHandleMain.id },
          { order: projectIssueHandleMainPost.order, isLast: true, isFirst: false, ...dataUpdate },
        ),
      );
    }

    if (!projectIssueHandlePostId && !projectIssueHandlePreId) {
      task.push(() => handleRepository.update({ id: projectIssueHandleMain.id }, { ...dataUpdate }));
    }

    await Promise.all(task.map((item) => item()));
    return true;
  }

  handleTextByKeyUpdateIssue(projectInfo: IGetProjectInfoCache, key: string, value: any) {
    const keysConvert = ['typeId', 'stateId', 'assigneeId', 'priority', 'versionId', 'categoryId'];

    if (!keysConvert.includes(key)) return value;
    const valueConvert = {
      ['typeId']: projectInfo?.projectIssueTypeById?.[value]?.name,
      ['stateId']: projectInfo?.projectIssueStateById?.[value]?.name,
      ['assigneeId']: projectInfo?.userProjectByUserId?.[value]?.user?.name,
      ['priority']: TextPriority[value],
      ['versionId']: projectInfo?.projectVersionById?.[value]?.name,
      ['categoryId']: projectInfo?.projectIssueCategoryById?.[value]?.name,
    };

    return valueConvert[key];
  }

  handleTextKeyUpdateIssue(key: string) {
    const keysConvert = ['typeId', 'stateId', 'assigneeId', 'versionId', 'categoryId'];

    if (!keysConvert.includes(key)) return key;

    const keyConvert = {
      ['typeId']: 'type',
      ['stateId']: 'state',
      ['assigneeId']: 'assignee',
      ['versionId']: 'version',
      ['categoryId']: 'category',
    };

    return keyConvert[key];
  }

  async formatErrorObject(exception: HttpException | WsException | any): Promise<any> {
    const errorObj: IFormatErrorObject = {
      success: false,
      statusCode: exception.status || HttpStatus.BAD_REQUEST,
      errorValue: ErrorCustom.Unknown_Error,
      devMessage: undefined,
      payload: undefined,
    };

    if (exception instanceof HttpException || exception instanceof WsException) {
      const data = exception instanceof HttpException ? exception.getResponse() : exception['error'];

      if (data?.error === 'Not Found') {
        return {
          success: false,
          statusCode: data?.status || HttpStatus.BAD_REQUEST,
          errorCode: ErrorCustom.Not_Found.ErrorCode,
          errorMessage: data?.message || ErrorCustom.Not_Found.ErrorMessage,
        };
      }

      if (data?.error === 'Bad Request') {
        return {
          success: false,
          statusCode: data?.status || HttpStatus.BAD_REQUEST,
          errorCode: ErrorCustom.Invalid_Input.ErrorCode,
          errorMessage: data?.message || ErrorCustom.Invalid_Input.ErrorMessage,
        };
      }

      const extraData = this.pickObject(data, ['errorValue', 'statusCode', 'devMessage', 'payload', 'errorMessage']);

      Object.assign(errorObj, extraData);

      if (data === 'ThrottlerException: Too Many Requests') {
        Object.assign(errorObj, {
          errorValue: ErrorCustom.The_Allowed_Number_Of_Calls_Has_Been_Exceeded,
          devMessage: 'Too Many Requests',
        });
      }
    }

    const errorValue = errorObj.errorValue;

    errorObj.errorMessage = errorValue.ErrorMessage;
    errorObj.errorCode = errorValue.ErrorCode;

    const keyOmit = ['errorValue'];
    if (this.configService.get<Environment>('nodeEnv', Environment.Development) === Environment.Production) {
      keyOmit.push('devMessage');
    }

    if (errorObj.errorMessage) {
      errorObj.errorMessage = format(errorObj.errorMessage, errorObj.payload);
    }
    return this.omitObject(errorObj, ['errorValue']) as any;
  }

  async socketFail(chanel: SocketEventKeys | string, error: unknown, payload = {}) {
    const errorObj = await this.formatErrorObject(error);

    const { statusCode, ...result } = {
      ...errorObj,
      chanel,
      ...payload,
    } as any;

    return result;
  }

  async socketSuccess(chanel: SocketEventKeys, userIdCall: number, data?: any, payload = {}) {
    if (data?.paging) {
      delete data.paging;
      return { success: true, chanel, ...data, ...payload };
    }

    return { success: true, userIdCall: userIdCall, chanel, data, ...payload };
  }

  revertKeyFromType(type: MailType) {
    const mailTypeKey = {
      [MailType.Client_Register_Account]: 'Client_Register_Account',
      [MailType.Client_Forgot_Password]: 'Client_Forgot_Password',
    };

    return mailTypeKey[type];
  }

  getMentionedUsers(content: string | undefined) {
    const mentionedUserIds: number[] = [];

    if (content) {
      const regex = /data-user-id="(\d+)"/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const userId = match[1];
        mentionedUserIds.push(userId as number);
      }
    }
    return mentionedUserIds;
  }
}
