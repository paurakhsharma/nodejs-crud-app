$(document).ready(() => {
    $('.delete-recipe').on('click', function() {
     var id = $(this).data('id');
     var url = '/delete/' + id;
     if (confirm('Delete recipe?')) {
      $.ajax({
       url: url,
       type: 'DELETE',
       success: function(result) {
        console.log('Deleting recipie...');
        window.location.href = '/';
       },
       error: function(err) {
        console.log(err);
       }
      });
     }
    });
    $('.edit-recipe').on('click', function() {
     console.log($(this).data('imagename'));
     $('#edit-form-name').val($(this).data('name'));
     $('#edit-form-ingredients').val($(this).data('ingredients'));
     $('#edit-form-direction').val($(this).data('direction'));
     $('#edit-form-imagename').val($(this).data('imagename'));
     $('#edit-form-image').attr("src", '/images/recipeImage/' + $(this).data('imagename'));
     $('#edit-form-id').val($(this).data('id'));
    });

    $('img').on('click', function() {
        $('.enlargeImageModalSource').attr('src', $(this).attr('src'));
        console.log($(this).data('name'));
        $('span').val('THi si a txt');
        $('#enlargeImageModal').modal('show');
    });
});