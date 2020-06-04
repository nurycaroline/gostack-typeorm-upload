import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute({ id }: { id: string }): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const findTransactionById = await transactionRepository.findOne({
      where: { id },
    });

    if (!findTransactionById) {
      throw new AppError('Id not found');
    }

    transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
