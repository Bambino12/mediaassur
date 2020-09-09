package com.df.mediaassur.repository;

import com.df.mediaassur.model.Marque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


/**
 * Created by Yessi on 04/08/20.
 */
@Repository
public interface MarqueRepository extends JpaRepository<Marque, Integer> {
    void delete(int id);
}