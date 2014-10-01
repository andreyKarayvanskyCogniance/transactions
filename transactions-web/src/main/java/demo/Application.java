package demo;

import java.math.BigDecimal;
import java.util.Date;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

        for (int i = 0; i < 100; i++) {
            final Account demoAccount = new Account();
            demoAccount.setCode(randomStr("C ", 20));
            demoAccount.setName(randomStr("N ", 50));

            accountRepository.save(demoAccount);

            final ThreadLocalRandom random = ThreadLocalRandom.current();

            if (random.nextBoolean()) {
                for (int j = 0; j < random.nextInt(0, 100); j++) {

                    final TransactionRepository transactionRepository = context.getBean(TransactionRepository.class);

                    final Transaction transaction = new Transaction();
                    transaction.setAmount(new BigDecimal(random.nextDouble(-100.0d, 100.0d)));
                    transaction.setAccount(demoAccount);
                    transaction.setDate(new Date());
                    transaction.setDescription(randomStr("T ", 100));
                    transaction.setType(random.nextBoolean() ? TransactionType.CREDIT : TransactionType.DEBIT);

                    transactionRepository.save(transaction);

                }
            }
        }

    }

    private static String randomStr(String token, int bound) {
        int len = ThreadLocalRandom.current().nextInt(1, bound / 2);

        return Stream.generate(() -> token).limit(len).collect(Collectors.joining());
    }
}