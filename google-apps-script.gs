/**
 * =========================================================================
 * BACKEND NHẬN ĐƠN HÀNG & GỬI EMAIL - MẦM (Green Gratitude)
 * Tự động ghi đơn vào Google Sheets và gửi email thông báo cho chủ shop
 * =========================================================================
 */

// CẤU HÌNH EMAIL CỦA SHOP
// Điền email của bạn để nhận thông báo khi có khách đặt hàng (để trống sẽ gửi về email của tài khoản Google này)
const SHOP_NOTIFICATION_EMAIL = "";

// Tên sheet lưu trữ đơn hàng
const SHEET_NAME = "Đơn Hàng MẦM";

/**
 * Xử lý khi website gửi đơn hàng lên (POST)
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Không có dữ liệu gửi lên" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const order = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Nếu chưa có sheet, tự động tạo mới và định dạng tiêu đề
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "Thời Gian",
        "Mã Đơn Hàng",
        "Tên Khách Hàng",
        "Số Điện Thoại",
        "Email",
        "Địa Chỉ Giao Hàng",
        "Sản Phẩm Đặt Mua",
        "Tổng Tiền",
        "Phương Thức Thanh Toán",
        "Trạng Thái",
        "Nội Dung Chuyển Khoản",
        "Ghi Chú Đơn Hàng"
      ];
      sheet.appendRow(headers);
      
      // Định dạng dòng tiêu đề
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1b4332");
      headerRange.setFontColor("#fdfbf7");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Định dạng chuỗi sản phẩm: SP1 x 2 (45.000đ), SP2 x 1 (15.000đ)
    let itemsText = "";
    if (order.items && Array.isArray(order.items)) {
      itemsText = order.items.map(function(item) {
        return item.name + " (SL: " + item.qty + " - " + item.price + ")";
      }).join("\n");
    }

    const initialStatus = order.payment === "Chuyển khoản" ? "Chờ thanh toán" : "Mới (COD)";

    // Ghi dòng đơn hàng mới vào Google Sheet
    sheet.appendRow([
      order.time || new Date().toLocaleString("vi-VN"),
      order.orderId || "",
      order.name || "",
      order.phone ? "'" + order.phone : "", // Dấu ' để giữ số 0 đầu số điện thoại
      order.email || "",
      order.address || "",
      itemsText,
      order.total || "",
      order.payment || "",
      initialStatus,
      order.payCode || "",
      order.note || ""
    ]);

    // Tự động căn chỉnh độ rộng cột
    sheet.autoResizeColumns(1, 12);

    // Gửi email thông báo cho chủ shop
    sendShopEmailNotification(order, itemsText);

    // Nếu khách có nhập email, gửi email xác nhận cho khách
    if (order.email && order.email.indexOf("@") !== -1) {
      sendCustomerConfirmationEmail(order, itemsText);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đơn hàng đã được lưu thành công",
      orderId: order.orderId
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Xử lý khi website kiểm tra trạng thái thanh toán (GET)
 * API: ?action=status&id=MAM-2026-XXXX
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : null;
    const orderId = e && e.parameter ? e.parameter.id : null;

    if (action === "status" && orderId) {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);
      let isPaid = false;

      if (sheet) {
        const data = sheet.getDataRange().getValues();
        // Cột 1 là Mã Đơn (index 1), Cột 9 là Trạng Thái (index 9)
        for (let i = 1; i < data.length; i++) {
          if (data[i][1] === orderId) {
            const status = String(data[i][9]).trim();
            if (status === "Đã thanh toán" || status === "Hoàn thành") {
              isPaid = true;
            }
            break;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        paid: isPaid,
        orderId: orderId
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(
      "🌿 Hệ thống Backend Nhận Đơn Hàng MẦM đang hoạt động bình thường!"
    );
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gửi email cho chủ shop
 */
function sendShopEmailNotification(order, itemsText) {
  try {
    const recipient = SHOP_NOTIFICATION_EMAIL || Session.getEffectiveUser().getEmail();
    if (!recipient) return;

    const subject = "🌱 [MẦM] Đơn Hàng Mới: " + order.orderId + " - " + order.name + " (" + order.total + ")";
    
    const body = 
      "🌿 BẠN CÓ ĐƠN ĐẶT HÀNG MỚI TỪ WEBSITE MẦM!\n\n" +
      "--------------------------------------------------\n" +
      "Mã đơn hàng: " + order.orderId + "\n" +
      "Thời gian: " + order.time + "\n" +
      "Khách hàng: " + order.name + "\n" +
      "Số điện thoại: " + order.phone + "\n" +
      "Email: " + (order.email || "Không cung cấp") + "\n" +
      "Địa chỉ giao hàng: " + order.address + "\n\n" +
      "--------------------------------------------------\n" +
      "SẢN PHẨM ĐẶT MUA:\n" + itemsText + "\n\n" +
      "--------------------------------------------------\n" +
      "TỔNG THANH TOÁN: " + order.total + "\n" +
      "Hình thức thanh toán: " + order.payment + "\n" +
      (order.payment === "Chuyển khoản" ? "Nội dung CK: " + order.payCode + "\n" : "") +
      "Ghi chú: " + (order.note || "Không có") + "\n\n" +
      "Vui lòng vào Google Sheets để kiểm tra và liên hệ giao hàng cho khách!";

    MailApp.sendEmail(recipient, subject, body);
  } catch (ex) {
    Logger.log("Lỗi gửi email cho shop: " + ex);
  }
}

/**
 * Gửi email xác nhận cho khách hàng
 */
function sendCustomerConfirmationEmail(order, itemsText) {
  try {
    const subject = "🌱 [MẦM] Xác Nhận Đơn Hàng #" + order.orderId + " - Cảm ơn bạn!";
    
    const body = 
      "Xin chào " + order.name + ",\n\n" +
      "Cảm ơn bạn đã lựa chọn trao gửi yêu thương và ươm mầm sự sống cùng MẦM!\n" +
      "Chúng tôi đã nhận được thông tin đặt hàng của bạn với chi tiết như sau:\n\n" +
      "Mã đơn hàng: " + order.orderId + "\n" +
      "Địa chỉ nhận hàng: " + order.address + "\n" +
      "Số điện thoại: " + order.phone + "\n\n" +
      "Sản phẩm đặt mua:\n" + itemsText + "\n\n" +
      "Tổng thanh toán: " + order.total + " (" + order.payment + ")\n" +
      (order.payment === "Chuyển khoản" ? "Nội dung chuyển khoản: " + order.payCode + "\n" : "") +
      "\nShop sẽ sớm liên hệ qua điện thoại để xác nhận đơn hàng và thời gian giao hàng.\n\n" +
      "Thân mến,\nĐội ngũ MẦM — Trao Gửi Yêu Thương – Ươm Mầm Sự Sống 🌿";

    MailApp.sendEmail(order.email, subject, body);
  } catch (ex) {
    Logger.log("Lỗi gửi email cho khách: " + ex);
  }
}
