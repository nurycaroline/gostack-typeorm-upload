import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRespository = getRepository(Category);
    const balance = await transactionRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Transaction not approved');
    }

    const findCategoryByTitle = await categoryRespository.findOne({
      where: { title: category },
    });

    let categoryId = findCategoryByTitle?.id;

    if (!findCategoryByTitle) {
      const newCategory = categoryRespository.create({ title: category });
      await categoryRespository.save(newCategory);
      categoryId = newCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
