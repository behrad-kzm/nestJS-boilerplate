import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from '../../../utils/common/entity-helper';
import { OTT_TYPE_ENUM } from '../enums/ott-types.enum';

@Entity()
export class OTTHistory extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  token!: string;

  @Column()
  expireAt!: Date;

  @Column({ default: false })
  isUsed!: boolean;

  @Column({ nullable: true })
  type!: OTT_TYPE_ENUM;

  @Column()
  consumer!: string;

}
