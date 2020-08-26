package com.df.mediaassur.repository;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Role;
import com.df.mediaassur.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Created by rajeevkumarsingh on 02/08/17.
 */
@Repository
public interface AttestationRepository extends JpaRepository<Attestation, Integer> {

    List<Attestation> findByLotId(Integer lotId);

}
