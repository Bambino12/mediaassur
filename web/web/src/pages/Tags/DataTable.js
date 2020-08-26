import React, { Component } from 'react';
import $ from "jquery";
$.DataTable = require("datatables.net");

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.$el = $(this.el);
        let json = this.props.jsonInit ? this.props.jsonInit : {};
        this.dttable = this.$el.DataTable(json);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.children !== this.props.children) {
            if(!this.$el) this.$el = $(this.el);
            try {
                if (!$.fn.DataTable.isDataTable(this.$el)) {
                    //let json = this.props.jsonInit ? this.props.jsonInit : {};
                }
            } catch (error) {
                console.log(error);
            }
        }

    }

    componentWillReceiveProps() {
        if(!this.$el) this.$el = $(this.el);
        try {
            if (!$.fn.DataTable.isDataTable(this.$el)) {
                //let json = this.props.jsonInit ? this.props.jsonInit : {};
            }
        } catch (error) {
            console.log(error);
        }

    }

    componentWillUnmount() {
        if(this.dttable){
            this.dttable.destroy();
        }
    }

    handleChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <div className="table-responsive">
                <table id={this.props.tableId ? this.props.tableId : new Date().getTime() } style={{width:"100%"}} className="table table-bordered table-striped" ref={el => this.el = el}>
                    {this.props.children}
                </table>
            </div>
        );
    }

}
export default DataTable
