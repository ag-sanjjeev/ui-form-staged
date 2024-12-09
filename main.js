/*
 ________________________________________________
(                  Staged Form                 ()
\-----------------------------------------------\
|                                               |
|   Copyright 2024 ag-sanjjeev                  |
|                                               |
|-----------------------------------------------|
|   The source code is licensed under           |
|   MIT-style License.                          |
|                                               |
|-----------------------------------------------|
|                                               |
|   The usage, permission and condition         |
|   are applicable to this source code          |
|   as per license.                             |
|                                               |
|-----------------------------------------------|
|                                               |
|   That can be found in LICENSE file           |
|   or at https://opensource.org/licenses/MIT.  |
(_______________________________________________(

*/

const carouselReference = $('#staged-form-carousel');
const validationRequired = {
	'blog-details' : ['blogName', 'blogDescription', 'blogLogo'],
	'admin-details' : ['firstName', 'lastName', 'gender', 'email', 'emailVerificationOtp', 'password', 'passwordConfirm'],
	'bank-details' : ['accountHolderName', 'ifsc', 'accountNumber', 'accountNumberConfirm']
};

// function to update carousel progress and indicators
function carouselProgress(currentIndex, totalItems) {
	let progress = Math.floor(currentIndex/totalItems) * 100;
	let firstIndex = 1;
	let lastIndex = totalItems;
	let i = currentIndex;

		if (firstIndex == lastIndex) {
			progress = 0;
		} else if (firstIndex == i) {
			progress = 0;
		} else if (lastIndex == i) {
			progress = 100;
		} else {
			try {
				progress = (100 / (totalItems - 1)) * (i - 1);

				if (progress < 0) {
					console.log('Negative progress');
					progress = 0;
				}	
			} catch(error) {
				console.log(error);
			}
		}
	// updating progress bar
	$('#progress-bar-container .progress-bar').css('width', progress + '%').attr('aria-valuenow', progress);	
	// updating progress indicator by toggle between two classes
	$('#progress-bar-container').find('.btn').each(function(index, element) {
		if ((index + 1) < currentIndex) {
			$(element).removeClass('btn-outline-primary').addClass('btn-primary');
		} else {
			$(element).removeClass('btn-primary').addClass('btn-outline-primary');
		}
	});
	$('#progress-bar-container').find(`.btn:nth-child(${i})`).toggleClass('btn-primary btn-outline-primary');
}

// function to update carousel control
function carouselControlUpdate(currentIndex, totalItems, validationResult=false) {
	
	// if validationResult is false then prevent click on next slide move
	if (!validationResult) {
		$('button#nextAndSubmitBtn').prop('disabled', true);
	} else {
		$('button#nextAndSubmitBtn').prop('disabled', false);
	}
	// First index
	if (currentIndex == 1) {
		$('button#previousBtn').prop('disabled', true);
	} else if (currentIndex == totalItems) { // Last index
		$('button#previousBtn').prop('disabled', false);		
		$('button#nextAndSubmitBtn').attr('type', 'submit').removeAttr('data-bs-slide');
		$('button#nextAndSubmitBtn').find('.controlIcon').addClass('d-none');
		$('button#nextAndSubmitBtn').find('.controlText').text('Submit');
	} else {
		$('button#previousBtn').prop('disabled', false);
		$('button#nextAndSubmitBtn').attr('type', 'button').attr('data-bs-slide', 'next')
		$('button#nextAndSubmitBtn').find('.controlIcon').removeClass('d-none');
		$('button#nextAndSubmitBtn').find('.controlText').text('Next');
	}
}

// function to validate before give next
function validateAtStage(ref, currentIndex, totalItems, callback) {	
	let validationResult = [];
	let currentStage = validationRequired[ref]; 
	if (currentStage === undefined) {		
		return false;
	}
	
	validationResult = validationRules(ref);

	// if every validation result gets true or not
	validationResult = validationResult.every(function(i) { return i; });
	callback(currentIndex, totalItems, validationResult);
}

// function to validate with rules
function validationRules(ref) {
	let validationResult = [];
	// custom validation rules
	if (ref == 'blog-details') {
		// blogName validation 
		if ($('[name="blogName"]').val() != '') {
			validationResult.push(true);
			$('[name="blogName"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="blogName"]').removeClass('is-valid').addClass('is-invalid');
		}

		// blogDescription validation
		if ($('[name="blogDescription"]').val() != '' && $('[name="blogDescription"]').val().length < 256) {
			validationResult.push(true);
			$('[name="blogDescription"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="blogDescription"]').removeClass('is-valid').addClass('is-invalid');
		}

		// blogLogo validation 
		if ($('[name="blogLogo"]').val() != '') {
			validationResult.push(true);
			$('[name="blogLogo"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="blogLogo"]').removeClass('is-valid').addClass('is-invalid');
		}
	}

	if (ref == 'admin-details') {
		// firstName validation 
		if ($('[name="firstName"]').val() != '') {
			validationResult.push(true);
			$('[name="firstName"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="firstName"]').removeClass('is-valid').addClass('is-invalid');
		}

		// gender validation		
		if ($('[name="gender"]').is(':checked')) {
			validationResult.push(true);
			$('[name="gender"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="gender"]').removeClass('is-valid').addClass('is-invalid');
		}

		// email validation 
		let emailRegex = /\S+@\S+\.\S+/;
		if ($('[name="email"]').val() != '' && emailRegex.test($('[name="email"]').val())) {
			validationResult.push(true);
			$('[name="email"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="email"]').removeClass('is-valid').addClass('is-invalid');
		}

		// otp validation 
		let optRegex = /\d+/g;
		if ($('[name="emailVerificationOtp"]').val() != '' && optRegex.test($('[name="emailVerificationOtp"]').val())) {
			validationResult.push(true);
			$('[name="emailVerificationOtp"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="emailVerificationOtp"]').removeClass('is-valid').addClass('is-invalid');
		}
		
		// password validation
		let passwordRegex = [/[a-z]/, /[A-Z]/, /[0-9]/, /\W/];
		let password = $('[name="password"]').val();
		let passwordValidationResult = passwordRegex.every(function(i) { return i.test(password) }) && password.length >= 6;
		if (passwordValidationResult) {
			validationResult.push(true);
			$('[name="password"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="password"]').removeClass('is-valid').addClass('is-invalid');
		}

		// passwordConfirm validation
		if ($('[name="password"]').val() === $('[name="passwordConfirm"]').val()) {
			validationResult.push(true);
			$('[name="passwordConfirm"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="passwordConfirm"]').removeClass('is-valid').addClass('is-invalid');
		}
	}

	if (ref == 'bank-details') {
		// accountHolderName validation 
		if ($('[name="accountHolderName"]').val() != '') {
			validationResult.push(true);
			$('[name="accountHolderName"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="accountHolderName"]').removeClass('is-valid').addClass('is-invalid');
		}

		// ifsc validation 
		if ($('[name="ifsc"]').val() != '') {
			validationResult.push(true);
			$('[name="ifsc"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="ifsc"]').removeClass('is-valid').addClass('is-invalid');
		}

		// accountNumber validation 
		if ($('[name="accountNumber"]').val() != '') {
			validationResult.push(true);
			$('[name="accountNumber"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="accountNumber"]').removeClass('is-valid').addClass('is-invalid');
		}

		// accountNumberConfirm validation 
		if ($('[name="accountNumber"]').val() === $('[name="accountNumberConfirm"]').val()) {
			validationResult.push(true);
			$('[name="accountNumberConfirm"]').removeClass('is-invalid').addClass('is-valid');
		} else {
			validationResult.push(false);
			$('[name="accountNumberConfirm"]').removeClass('is-valid').addClass('is-invalid');
		}

	}

	return validationResult;
}

// Document ready event
$(document).ready(function() {
	const carouselForm = new bootstrap.Carousel(carouselReference);
	let totalItems = $('.carousel-item').length;
	let currentIndex = $('.carousel-item.active').index() + 1;
	let activeCarouselReference = $('.carousel-item.active').attr('id');

	// form element event listener
	for (let i in validationRequired) { 
		validationRequired[i].forEach(function(j) {
			$(`[name="${j}"]`).on('input change', function() {
				// current index will change on each slide 
				validateAtStage(i, $('.carousel-item.active').index() + 1, totalItems, carouselControlUpdate);
			});
		});
	}

	carouselProgress(currentIndex, totalItems);

	// carousel event listener
	$(carouselReference).on('slid.bs.carousel', function(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
		activeCarouselReference = $('.carousel-item.active').attr('id');
		let currentIndex = event.to + 1;
		validateAtStage(activeCarouselReference, currentIndex, totalItems, carouselControlUpdate);
		carouselProgress(currentIndex, totalItems);
	});
});

