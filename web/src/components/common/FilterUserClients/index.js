import React, { useState, useEffect } from 'react';

import { Form, Select, Col, Row } from 'antd';
import {connect} from "react-redux";

import { handleService } from 'helpers';
import { getUserAgences } from 'services/agence'
import { getAgenceTeams } from 'services/team';
import { getTeamZones, getUserZones } from 'services/zone';
import { getZoneClients, getTeamClients, getAgenceClients } from 'services/client';


const { Option } = Select;

function FilterForm(props) {
  const { hasRole } = props
  const [state, setState] = useState({
    agences : [],
    teams : [],
    zones : [],
    agenceId: "",
    teamId: "",
    loadingAgences: false,
    loadingTeams: false,
    loadingZones: false,
  })

  const [form] = Form.useForm();
  
  function loadAgences(){
    setState(state => ({...state, loadingAgences: true }))

    handleService(getUserAgences, null, (response) => {
      const agences = response ? response : []

      if(hasRole.ca || hasRole.ce){
        loadTeams(agences[0].id)
      }

      setState(state => ({
        ...state, 
        loadingAgences: false,
        agences: agences,
      }));
    })
  }

  function loadTeams(agenceId){
    setState(state => ({...state, loadingTeams: true }))

    if(agenceId){
      handleService(getAgenceTeams, agenceId, (response) => {
        const teams = response ? response : []

        if(hasRole.ce){
          loadZones(teams[0].id)
        }

        setState(state => ({
          ...state,
          loadingTeams: false,
          teams: teams,
        }));
      })
    }else{
      // handleService(getUserTeams, null, (response) => {
      //   setState(state => ({
      //     ...state, 
      //     loadingTeams: false,
      //     teams: (response ? response : []),
      //   }));
      // })
    }
  }

  function loadZones(teamId){
    setState(state => ({...state, loadingZones: true }))

    if(teamId){
      handleService(getTeamZones, teamId, (response) => {
        setState(state => ({
          ...state, 
          loadingZones: false,
          zones: (response ? response : []),
        }));
      })
    }else{
      handleService(getUserZones, null, (response) => {
        setState(state => ({
          ...state, 
          loadingZones: false,
          zones: (response ? response : []),
        }));
      })
    }
  }
  
  function loadClients(zoneId){
    props.getClients(null, true)

    handleService(getZoneClients, zoneId, (response) => {
      const clients = response || []
      props.getClients(clients, false)
    })
  }

  function loadTeamClients(teamId){
    props.getClients(null, true)

    handleService(getTeamClients, teamId, (response) => {
      const clients = response || []
      props.getClients(clients, false)
    })
  }

  function loadAgenceClients(agenceId){
    props.getClients(null, true)

    handleService(getAgenceClients, agenceId, (response) => {
      const clients = response || []
      props.getClients(clients, false)
    })
  }

  useEffect(() => {
    loadAgences()
  }, [])

  return (
    <Form layout="vertical" hideRequiredMark form={form} name="control-hooks">
      <Row gutter={16}>
        {(hasRole.admin || hasRole.controller) && (
          <Col xs={24} md={8}>
            <Form.Item
              name="agenceId"
              // label="Agence"
              rules={[{ required: true, message: "Veuillez selectionner l'agence" }]}
            >
              <Select 
                loading={state.loadingAgences}
                placeholder="Veuillez selectionner l'agence" 
                onChange={(value) => {
                  loadTeams(value);
                  form.setFieldsValue({teamId: null, zoneId: null})
                  props.getClients([])
                }} 
                notFoundContent="Aucune agence"
              >
                {state.agences.map(( m, index) => (
                  <Option key={m.id} value={m.id}>
                    {m.libelle} <strong>({m.code})</strong>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        {!(hasRole.ce || hasRole.acj) && (
          <Col xs={24} sm={12} md={(hasRole.admin || hasRole.controller) ? 8 : 12}>
            <Form.Item
              name="teamId"
              // label="Equipe"
              rules={[{ required: true, message: "Veuillez selectionner l'équipe" }]}
            >
              <Select 
                loading={state.loadingTeams}
                placeholder="Veuillez selectionner l'équipe" 
                onChange={(value) => {
                  if(value === 0){
                    const agenceId = form.getFieldValue('agenceId')
                    setState(state => ({...state, zones: []}))
                    loadAgenceClients(agenceId)
                  }else{
                    loadZones(value)
                  }

                  form.setFieldsValue({zoneId: null})
                  props.getClients([])
                }} 
                notFoundContent="Aucune équipe"
              >
                {state.teams.length > 0 && <Option value={0}>Toutes les équipes</Option>}
                {state.teams.map(( m, index) => (
                  <Option key={m.id} value={m.id}>{m.libelle}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        <Col xs={24} sm={12} md={(hasRole.admin || hasRole.controller) ? 8 : 12}>
          <Form.Item
            name="zoneId"
            // label="Zone"
            rules={[{ required: true, message: "Veuillez selectionner la zone" }]}
          >
            <Select 
              loading={state.loadingZones}
              placeholder="Veuillez selectionner la zone" 
              onChange={(value) => {
                if(value === 0){
                  const teamId = form.getFieldValue('teamId')
                  loadTeamClients(teamId)
                }else{
                  loadClients(value)}
                }
              } 
              notFoundContent="Aucune zone"
            >
              {state.zones.length > 0 && <Option value={0}>Toutes les zones</Option>}
              {state.zones.map(( m, index) => (
                <Option key={m.id} value={m.id}>{m.libelle}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    hasRole: state.auth.hasRole
  }
}

export default connect(mapStateToProps)(FilterForm)