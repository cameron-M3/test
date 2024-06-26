import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class OppCard extends NavigationMixin(LightningElement) {

    @api name;
    @api amount;
    @api stage;
    @api closeDate;
    @api oppId;

    // create a method to navigate to the full Opportunity record
    viewRecord() {
        // call the Navigate method of the NavigationMixin class and pass in some parameters
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view'
            }
        });
    }

    editOpp(){
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            formMode:'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Opportunity'
        })
        .then((result)=>{
            console.log(result);
            if (result == 'modsuccess') {
                // dispatch a toast event
                this.dispatchToast(
                    'Opportunity Saved Successfully',
                    'The opportunity record was saved successfully',
                    'success',
                    'dismissible'
                );

                // dispatch a custom event to tell opportunityList to refresh the records
                const savedEvent = new CustomEvent('modsaved');
                this.dispatchEvent(savedEvent);
            }

            if (result == 'modcancel') {
                
                const cancelEvent = new ShowToastEvent({
                    title: 'No Changes Made',
                    message: '',
                    variant: 'info',
                    mode: 'dismissiable'
                });
                this.dispatchEvent(cancelEvent);
            }

        })
    }

    dispatchToast(title, message, variant, mode){
        // create a Toast Event
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });

        // dispatch my Toast Event
        this.dispatchEvent(toastEvent);
    }




}