package demo;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;

import demo.model.Account;
import demo.model.Transaction;
import demo.model.TransactionType;
import demo.repo.AccountRepository;
import demo.repo.TransactionRepository;

@ComponentScan
@EnableAutoConfiguration
public class Application {

    public static void main(String[] args) {
        final ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

        // TODO remove test code
        final AccountRepository accountRepository = context.getBean(AccountRepository.class);
        
        final Account demoAccount = new Account();
        demoAccount.setCode("demo1");
        demoAccount.setName("The Very First Demo Account");
        
        accountRepository.save(demoAccount);

        final TransactionRepository transactionRepository = context.getBean(TransactionRepository.class);
        
        final Transaction transaction = new Transaction();
        transaction.setAmount(new BigDecimal(10.0d));
        transaction.setAccount(demoAccount);
        transaction.setDate(new Date());
        transaction.setDescription("A Demo Transaction");
        transaction.setType(TransactionType.DEBIT);
        
        transactionRepository.save(transaction);
    }
}