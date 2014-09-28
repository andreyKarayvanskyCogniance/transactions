package demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import demo.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

}
