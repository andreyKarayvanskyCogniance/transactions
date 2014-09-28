package demo.controllers;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Date;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import demo.model.Account;
import demo.model.Transaction;
import demo.model.TransactionType;
import demo.repo.AccountRepository;
import demo.repo.TransactionRepository;

public class AccountsControllerTest extends AbstractMvcControllerTest {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private Account normalAccount;

    @Before
    public void prepareData() {
        normalAccount = new Account();
        normalAccount.setCode("tst1");
        normalAccount.setName("Test account");
    }

    @Test
    public void create() throws Exception {
        final Long id = postCreateJson(normalAccount);

        assertThat(accountRepository.findOne(id), equalTo(normalAccount));
    }

    @Test
    public void nameConstraint() throws Exception {
        // 51 symbols name (50 max allowed)
        normalAccount.setName("_123456789_123456789_123456789_123456789_123456789=");
        
        postCreateJson(normalAccount, status().isBadRequest());
    }

    @Test
    public void codeConstraint() throws Exception {
        // 21 symbols name (20 max allowed)
        normalAccount.setName("_123456789_123456789=");
        
        postCreateJson(normalAccount, status().isBadRequest());
    }

    @Test
    public void update() throws Exception {
        final Account saved = accountRepository.save(normalAccount);

        saved.setName("Updated test account");

        final Account updated = putUpdateJson(saved, saved.getId());

        assertThat(updated, equalTo(saved));
    }

    @Test
    public void delete() throws Exception {
        final Account saved = accountRepository.save(normalAccount);

        deleteJson(status().isOk(), saved.getId());

        // deleted and cannot found in DB
        assertThat(accountRepository.findOne(saved.getId()), nullValue());
    }

    @Test
    public void deleteRejected_accountHasTransacton() throws Exception {
        final Account account = accountRepository.save(normalAccount);
        
        final Transaction transaction = new Transaction();
        transaction.setDate(new Date());
        transaction.setAmount(new BigDecimal(100.0d));
        transaction.setAccount(account);
        transaction.setType(TransactionType.CREDIT);

        transactionRepository.save(transaction);

        deleteJson(status().isBadRequest(), account.getId());

        // still in DB
        assertThat(accountRepository.findOne(account.getId()), notNullValue());
    }

    @Override
    protected String url() {
        return "/account";
    }

}
