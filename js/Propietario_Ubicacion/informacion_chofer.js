$(document).ready(function () {
/* ---------------------------------------------------- */
/* VISULIZAR LAS CONTRASEÑAS							*/
/*----------------------------------------------------- */
		$("#icon-click1").click(function() {
			$("#icon1").toggleClass('fa-eye-slash');

			var input = $("#pass1");
			if (input.attr("type") === "password") {
				input.attr("type", "text");
			} else {
				input.attr("type", "password");
			}
		});


		$("#icon-click2").click(function() {
			$("#icon2").toggleClass('fa-eye-slash');

			var input = $("#pass2");
			if (input.attr("type") === "password") {
				input.attr("type", "text");
			} else {
				input.attr("type", "password");
			}
		});

		$("#icon-click3").click(function() {
			$("#icon3").toggleClass('fa-eye-slash');

			var input = $("#pass3");
			if (input.attr("type") === "password") {
				input.attr("type", "text");
			} else {
				input.attr("type", "password");
			}
		});

});
