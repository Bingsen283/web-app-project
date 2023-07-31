import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2shopValidators {

    static notOnlyWhiteSpace(formControl: FormControl): ValidationErrors {

        if ((formControl.value != null) && formControl.value.trim().length === 0) {
            return { "notOnlyWhiteSpace": true }
        }
        return null;
    }
}
