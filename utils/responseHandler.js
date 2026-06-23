// دي دالة بسيطة بتاخد حالة الرد، رسالة توضيحية، والبيانات (لو موجودة)
exports.sendResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success: success, // true لو العملية نجحت، false لو في خطأ
    message: message, // رسالة بتشرح إيه اللي حصل
    data: data        // الداتا الفعلية (زي بيانات المستخدم)
  });
};