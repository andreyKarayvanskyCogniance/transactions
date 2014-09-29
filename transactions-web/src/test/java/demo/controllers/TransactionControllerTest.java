package demo.controllers;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import demo.model.Account;
import demo.model.Transaction;
import demo.model.TransactionType;
import demo.repo.AccountRepository;
import demo.repo.TransactionRepository;

public class TransactionControllerTest extends AbstractMvcControllerTest {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private Account savedAccount;
    private Long savedAccountId;
    
    private Transaction transaction;

    @Before
    public void prepareData() {
        final Account acc = new Account();
        acc.setCode("tst1");
        acc.setName("Test account");

        savedAccount = accountRepository.save(acc);
        savedAccountId = savedAccount.getId();

        transaction = new Transaction();
        transaction.setAccount(savedAccount);
        transaction.setAmount(new BigDecimal(20.0d));
        transaction.setDate(new Date());
        transaction.setDescription("Test transaction");
        transaction.setType(TransactionType.CREDIT);

    }

    @Test
    public void list() throws Exception {
        final Transaction saved = transactionRepository.save(transaction);
        
        List<Transaction> list = listPageContent(Transaction.class, savedAccountId, "transaction");

        saved.setAccount(null); // account should not be returned

        assertThat(list, contains(saved));
    }
    
    @Test
    public void create() throws Exception {
        final Long id = postCreateJson(transaction, savedAccountId, "transaction");
        transaction.setId(id);

        assertThat(transactionRepository.findOne(id), equalTo(transaction));
    }

    @Test
    public void descriptionConstraint() throws Exception {
        // 101 symbols name (100 max allowed)
        this.transaction
                .setDescription("_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789_123456789=");

        postCreateJson(this.transaction, status().isBadRequest(), savedAccountId, "transaction");
    }

    @Test
    public void update() throws Exception {
        final Transaction saved = transactionRepository.save(transaction);

        saved.setType(TransactionType.DEBIT);

        putUpdateJson(saved, status().isOk(), savedAccountId, "transaction", saved.getId());

        assertThat(transactionRepository.findOne(saved.getId()), equalTo(saved));
    }

    @Test
    public void updateNonExisting() throws Exception {
        // invalid id here
        putUpdateJson(transaction, status().isNotFound(), savedAccountId, "transaction", 777l);
    }

    @Test
    public void deleteNotAllowed() throws Exception {
        final Transaction saved = transactionRepository.save(transaction);

        deleteJson(status().isMethodNotAllowed(), savedAccountId, "transaction", saved.getId());
    }

    @Override
    protected String url() {
        return "/account/";
    }

}
