import React, { Component } from 'react';
import { Steps, Button, message } from 'antd';
import UploadStep1 from 'pages/Importation/UploadStep1';
import UploadStep3 from 'pages/Importation/UploadStep3';
import UploadStepResume from 'pages/Importation/UploadStepResume';



const { Step } = Steps;

class AfficheUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            fileAttestation:{
                assureId : "",
                assureName : "",
                assureurId : "",
                assureurName : "",
                numeroPolice : "",
                startDate : "",
                endDate : "",
                fileName : "",
                attestations:[]
            }
        };
    }

    next(props) {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    updateFileAttestation = info =>{
        //console.log("=====================================",info)
        this.setState({
            fileAttestation:info
        })
        //console.log("=====================================",info)
    }

    render(){
        const { current } = this.state;
        const steps = [
            {
                title: 'Sélection',
                content: <UploadStep1 parent={this}/>,
            },
            {
                title: 'Génération',
                content: <UploadStep3 parent={this}/>,
            },
            {
                title: 'Résumé',
                content: <UploadStepResume parent={this}/>,
            }
        ];
        return (
            <div>

                <div className="container-fluid m-0 pl-4 text-left" style={{backgroundColor:"white"}}>
                    <div className="row m-0 p-0">
                            <div style={{width:"100%"}}>
                                <div className="card-body m-0 p-0">
                                    <Steps  current={current}>
                                        {steps.map(item => (
                                            <Step style={{paddingRight: "140px", paddingLeft:'100px', marginTop:'10px'}} key={item.title} title={item.title} />
                                        ))}
                                    </Steps>
                                    <hr/>
                                    <div className="steps-content">{steps[current].content}</div>
                                    <br/>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </div>
        );
    }
}
export default AfficheUpload;
