import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { idDocumentNumber, firstName, lastName, password, email, phone, roleId } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const user = await UserModel.create({ 
        idDocumentNumber, 
        firstName, 
        lastName, 
        password: hashedPassword, 
        email, 
        phone, 
        roleId 
    } as any);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating user.');
  }
};

export const login = async (req: Request, res: Response): Promise<Response<any, Record<string, any>>> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(404).send('User not found.');

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send('Invalid password.');

    const token = jwt.sign({ 
      id: user.id, 
      role: user.roleId 
    }, 'supersecret', { expiresIn: 86400 });
    return res.status(200).send({ auth: true, token });
  } catch (err) {
    return res.status(500).send('Error logging in.');
  }
};