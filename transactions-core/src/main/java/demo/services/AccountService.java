package demo.services;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import demo.model.Account;
import demo.repo.AccountRepository;

@Service
@Transactional
public class AccountService {

    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);
    
    @Autowired
    private AccountRepository accountRepository;

    public List<Account> list() {
        return accountRepository.findAll();
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
        accountRepository.delete(id);
        
        logger.info("Deleted account {}", id);
    }

}
