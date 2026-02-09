import { body } from 'express-validator'

export const registerValidation = [
  body('username').trim().notEmpty().withMessage('Username обязателен'),

  body('fullName').trim().notEmpty().withMessage('Полное имя обязательно'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email обязателен')
    .isEmail()
    .withMessage('Некорректный email'),

  body('password').notEmpty().withMessage('Пароль обязателен'),
]

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email обязателен')
    .isEmail()
    .withMessage('Некорректный email'),

  body('password').notEmpty().withMessage('Пароль обязателен'),
]
