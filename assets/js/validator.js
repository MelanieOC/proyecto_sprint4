/*$(document).ready(() =>{
	let validator = $('#contactForm').bootstrapValidator({
		fields : {
			email : {

			}
		}
	})
})*/
$(document).ready(function() {
 $("input").not("[type=submit]").jqBootstrapValidation(); 
});