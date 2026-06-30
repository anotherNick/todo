export default class FormView {

    constructor(form, modal) {

        this.form = form;
        this.modal = modal;

    }

    showValidFields(item, action) {

              this.form.reset();
        
        const hiddenInputs = this.form.querySelectorAll('input[type="hidden"]');
              hiddenInputs.forEach(input => {
                input.value = '';
              });
        
        const formTitle = document.getElementById('form-title');
              formTitle.textContent =  `${action} ${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`;
    
        const itemFields = document.querySelectorAll('.item-fields');
              itemFields.forEach(fieldset => {

                fieldset.classList.add('hidden');
                fieldset.disabled = true;

              });

        const fieldType = `.${item.type}-fields`;
        const validFields = document.querySelectorAll(fieldType);
              validFields.forEach(fieldset => {

                fieldset.classList.remove('hidden');
                fieldset.disabled = false;

              });

    }

    updateInputValues(item, action = "Update") {

        this.showValidFields(item, action);
        
        Object.entries(item).forEach(property => {
            
            const input = document.querySelector(`[name="${property[0]}"]`);
            
            if(property[0] === "priority"){
                
                const radio = document.querySelector(`input[value="${property[1]}"]`);
                      radio.checked = true;
                
            } else if(input !== null) {
            
                
                input.value = property[1];
            
            }

        });

    }

    reset() {

        this.form.reset();
        const hiddenInputs = this.form.querySelectorAll('input[type="hidden"]');
              hiddenInputs.forEach(input => {
                input.value = '';
            });

    }

    showModal() {

        this.modal.showModal();

    }

    closeModal() {

        this.modal.close();

    }

}