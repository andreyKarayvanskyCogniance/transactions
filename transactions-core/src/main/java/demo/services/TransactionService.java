package demo.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import demo.model.Account;
import demo.model.Transaction;
import demo.repo.AccountRepository;
import demo.repo.TransactionRepository;

@Service
@Transactional
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    public Page<Transaction> findByAccountId(Long accountId, Pageable pageable) {
        return transactionRepository.findByAccountId(accountId, pageable);
    }

    public Transaction findOne(Long accountId, Long id) {

        final Transaction transaction = transactionRepository.findOne(id);

        if (transaction == null || !transaction.getAccount().getId().equals(accountId)) {
            return null;
        }
        return transaction;
    }

    public Transaction save(Long accountId, Transaction transaction) {

        transaction.setAccount(accountRepository.findOne(accountId));

        final Transaction saved = transactionRepository.save(transaction);

        logger.info("Created {}", saved);
        return saved;
    }

    public Transaction update(Account account, Transaction transaction) {
        transaction.setAccount(account);
        
        final Transaction saved = transactionRepository.save(transaction);

        logger.info("Updated {}", saved);

        return saved;
    }

}
