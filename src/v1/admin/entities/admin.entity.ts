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
export class AdminUser extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

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
