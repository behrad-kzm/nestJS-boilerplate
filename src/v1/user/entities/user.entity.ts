import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from '../../../utils/common/entity-helper';
import * as bcrypt from 'bcryptjs'
import { hasValue } from '../../../utils/validators/is-empty.validator';

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  email!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column()
  password!: string;

  @Column()
  phone!: string;

  @Column({ default: false })
  phoneVerified!: boolean;

  @Column({ default: false })
  isBan!: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setEmail() {
    if (hasValue(this.email)) {
      this.email = this.email.toLocaleLowerCase()
    }
  }
}
