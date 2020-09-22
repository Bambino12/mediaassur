package com.df.mediaassur.repository;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by rajeevkumarsingh on 02/08/17.
 */
@Repository
public interface LotRepository extends JpaRepository<Lot, Integer> {
    List<Lot> findByAssureId(Integer assureId);
    List<Lot> findByAssureurId(Integer assureurId);
}
