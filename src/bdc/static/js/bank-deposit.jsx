import {
    fetchAuth,
    getAPIBaseURL,
    isPostiveNumeric,
    NavbarTitle,
    SelectizeUtils
} from 'Utils'

const {
    Input,
    Row
} = FRC

import {
    BootstrapTable,
    TableHeaderColumn
} from 'react-bootstrap-table'
import 'node_modules/react-bootstrap-table/dist/react-bootstrap-table.min.css'

import ReactSelectize from 'react-selectize'
const SimpleSelect = ReactSelectize.SimpleSelect

import classNames from 'classnames'

const {
    ToastContainer
} = ReactToastr
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation)

Formsy.addValidationRule('isPostiveNumeric', isPostiveNumeric)

const BankDepositForm = React.createClass({

    mixins: [FRC.ParentContextMixin],

    propTypes: {
        children: React.PropTypes.node
    },

    render() {
        return (
            <Formsy.Form
                className={this.getLayoutClassName()}
                {...this.props}
                ref="bank-deposit"
            >
                {this.props.children}
            </Formsy.Form>
        );
    }
});

var BankDepositPage = React.createClass({

    getInitialState() {
        return {
            canSubmit: false,
            validFields: false,
            validCustomFields: false,
            currentSoldeData: undefined,
            bankDepositList: undefined,
            depositAmount: undefined,
        }
    },

    componentDidMount() {
        // Get payment_modes
        var computePaymentModes = (paymentModes) => {
            // 'Euro-LIQ'
            // 'Euro-CHQ'
            // 'Eusko-LIQ' <- We don't want the eusko payment mode in this page.
            this.setState({paymentModeList:
                           _.filter(paymentModes, (item) => {
                                        return item.value.toLowerCase().indexOf("eusko") === -1
                                    })
                          })
        }
        fetchAuth(getAPIBaseURL + "payment-modes/", 'get', computePaymentModes)

        var computeBankDepositList = (bankDepositList) => {
            this.setState({bankDepositList: bankDepositList});
        };

        // Get bankDepositList history
        fetchAuth(getAPIBaseURL + "payments-available-deposit/", 'get', computeBankDepositList)
    },

    // paymentMode
    paymentModeOnValueChange (item) {
        this.setState({paymentMode: item}, this.validateForm)
        // TODO update bankDepositList
    },

    enableButton() {
        this.setState({canSubmit: true})
    },

    disableButton() {
        this.setState({canSubmit: false})
    },

    validFields() {
        this.setState({validFields: true}, this.validateForm)
    },

    validateForm() {
        if (this.state.paymentMode)
        {
            this.setState({validCustomFields: true})

            if (this.state.validFields)
                this.enableButton()
            else
                this.disableButton()
        }
        else
            this.disableButton()
    },

    submitForm(data) {
        data.member_login = this.state.member.login
        data.payment_mode = this.state.paymentMode.cyclos_id

        var computeForm = (data) => {
            this.setState({data: data})
            this.refs.container.success(
                __("L'enregistrement s'est déroulée correctement."),
                "",
                {
                    timeOut: 5000,
                    extendedTimeOut: 10000,
                    closeButton:true
                }
            )
        }

        var promiseError = (err) => {
            // Error during request, or parsing NOK :(
            console.error(this.props.url, err)
            this.refs.container.error(
                __("Une erreur s'est produite lors de l'enregistrement !"),
                "",
                {
                    timeOut: 5000,
                    extendedTimeOut: 10000,
                    closeButton:true
                }
            )
        }
        fetchAuth(this.props.url, this.props.method, computeForm, data, promiseError)
    },

    render() {
        // Display current solde information
        if (this.state.depositAmount) {
            var depositAmountLabel = (
                <span className="solde-deposit-span">
                    {this.state.depositAmount}
                </span>
            )
        }
        else
            var currentSoldeLabel = null

        var divAmountClass = classNames({
            'form-group row': true,
            'has-error has-feedback': this.state.amountInvalid,
        })

        var reactSelectizeErrorClass = classNames({
            'react-selectize-manager-history': true,
            'has-error has-feedback': this.state.amountInvalid,
        })


        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: (row, isSelected, event) => {
                // window.location.assign("/members/" + row.id)
            }
        }

        // History data table
        if (this.state.bankDepositList) {
            var dataTable = (
                <BootstrapTable
                 data={this.state.bankDepositList} striped={true} hover={true}
                 selectRow={selectRowProp} tableContainerClass="react-bs-table-account-history"
                 options={{noDataText: __("Rien à afficher.")}}
                 >
                    <TableHeaderColumn dataField="date" isKey={true}>{__("Date")}</TableHeaderColumn>
                    <TableHeaderColumn dataField="label">{__("Libellé")}</TableHeaderColumn>
                    <TableHeaderColumn dataField="amount">{__("Montant")}</TableHeaderColumn>
                    <TableHeaderColumn dataField="solde">{__("Solde")}</TableHeaderColumn>
                </BootstrapTable>
            )
        }
        else
            var dataTable = null;

        return (
            <div className="row">
                <div className="col-md-3 history-form">
                    <div className="row"></div>
                    <BankDepositForm
                        onValidSubmit={this.submitForm}
                        onInvalid={this.disableButton}
                        onValid={this.validFields}
                        ref="bank-deposit">
                        <fieldset>
                            <Input
                                name="amount"
                                data-eusko="bank-deposit-amount"
                                value=""
                                label={__("Montant")}
                                type="number"
                                placeholder={__("Montant du dépôt")}
                                validations="isPostiveNumeric"
                                validationErrors={{
                                    isPostiveNumeric: __("Montant invalide.")
                                }}
                                elementWrapperClassName={[{'col-sm-9': false}, 'col-sm-8']}
                                required
                            />
                            <div className={divAmountClass}>
                                <label
                                    className="control-label col-sm-3"
                                    data-required="true"
                                    htmlFor="bank-deposit-payment_mode">
                                    {__("Mode de paiement")}
                                    <span className="required-symbol">&nbsp;*</span>
                                </label>
                                <div className="col-sm-8 bank-deposit" data-eusko="bank-deposit-payment_mode">
                                    <SimpleSelect
                                        className={reactSelectizeErrorClass}
                                        ref="select"
                                        value={this.state.paymentMode}
                                        options={this.state.paymentModeList}
                                        placeholder={__("Mode de paiement")}
                                        theme="bootstrap3"
                                        onValueChange={this.paymentModeOnValueChange}
                                        renderOption={SelectizeUtils.selectizeRenderOption}
                                        renderValue={SelectizeUtils.selectizeRenderValue}
                                        onBlur={this.validateForm}
                                        renderNoResultsFound={SelectizeUtils.selectizeNoResultsFound}
                                        required
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <Row layout="horizontal">
                                <input
                                    name="submit"
                                    data-eusko="bank-deposit-submit"
                                    type="submit"
                                    defaultValue={__("Enregistrer")}
                                    className="btn btn-success"
                                    formNoValidate={true}
                                    disabled={!this.state.canSubmit}
                                />
                            </Row>
                        </fieldset>
                    </BankDepositForm>
                </div>
                <div className="col-md-9 col-history-table">
                    <div className="row margin-right">
                        {dataTable}
                    </div>
                </div>
                <ToastContainer ref="container"
                                toastMessageFactory={ToastMessageFactory}
                                className="toast-top-right toast-top-right-navbar"
                />
            </div>
        );
    }
})


ReactDOM.render(
    <BankDepositPage />,
    document.getElementById('bank-deposit')
)

ReactDOM.render(
    <NavbarTitle title={__("Dépot en banque")} />,
    document.getElementById('navbar-title')
)