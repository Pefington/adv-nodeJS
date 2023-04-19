const deleteProduct = async (btn) => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrfToken = btn.parentNode.querySelector('[name=csrfToken]').value;
  const productElement = btn.closest('article');

  await fetch(`/admin/product/${productId}`, {
    method: 'delete',
    headers: {
      csrfToken,
    },
  });

  productElement.parentNode.removeChild(productElement);
};
