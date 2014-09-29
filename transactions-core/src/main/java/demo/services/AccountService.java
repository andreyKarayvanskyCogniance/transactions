package demo.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import demo.model.Account;
import demo.repo.AccountRepository;
import demo.repo.TransactionRepository;

@Service
@Transactional
public class AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public Page<Account> list(Pageable pageable) {
        return accountRepository.findAll(pageable);
    }

    public Account findOne(Long id) {
        return accountRepository.findOne(id);
    }

    public Account save(Account account) {
        final Account saved = accountRepository.save(account);

        logger.info("Created {}", saved);
        return saved;
    }

    public Account update(Account account) {
        final Account saved = accountRepository.save(account);

        logger.info("Updated {}", saved);

        return saved;
    }

    public void delete(Long id) {
        boolean noTrasactions = transactionRepository.findByAccountId(id, new PageRequest(0, 1)).getContent().isEmpty();

        if (!noTrasactions) {
            throw new IllegalArgumentException("Account (id: " + id + ") cannot be deleted since it has transactions.");
        }

        accountRepository.delete(id);

        logger.info("Deleted account {}", id);
    }

}
