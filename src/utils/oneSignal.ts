import ROneSignal from "react-onesignal";

export class OneSignal {
  static init(onSuccess?: () => void) {
    ROneSignal.init({
      appId: import.meta.env.VITE_ONE_SIGNAL_APP_ID || "",
      notifyButton: {
        enable: true,
      },
      serviceWorkerParam: { scope: "/admin/onesignal/" },
      serviceWorkerPath: "/admin/onesignal/oneSignalSDKWorker.js",
    });

    onSuccess?.();
  }

  /**
   * lắng nghe khi notification xuất hiện
   */
  static addEventWhenOpened(cb: (event: any) => void) {
    ROneSignal.addListenerForNotificationOpened((event) => {
      cb(event);
    });
  }

  static async subscribe(sub: boolean) {
    await OneSignal.notifyPermission();
    // subscribe?.(true);
    // ROneSignal.getSubscription((isSub) => {
    //
    await ROneSignal.setSubscription(sub);
    // });
  }

  static notifyPermission(request = true) {
    return new Promise((resolve, reject) => {
      if (
        !(
          window.Notification /* W3C Specification */ ||
          //@ts-ignore
          window.webkitNotifications /* old WebKit Browsers */ ||
          //@ts-ignore
          navigator.mozNotification
        )
      ) {
        reject("Không tồn tại Notification");
      } else if (Notification.permission === "granted") {
        resolve(true);
      } else if (Notification.permission !== "denied") {
        if (request) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              resolve(true);
            } else {
              reject();
            }
          });
        } else {
          reject();
        }
      } else {
        if (request) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              resolve(true);
            } else {
              reject();
            }
          });
        } else {
          reject();
        }
      }
    });
  }

  /**
   * lắng nghe khi hiển thị notification
   */
  static notificationDisplay(cb: (event: any) => void) {
    ROneSignal.on("notificationDisplay", function (event) {
      cb(event);
      console.warn("OneSignal notification displayed:", event);
    });
  }
  /**
   * remove lắng nghe khi hiển thị vào notification
   */
  static removeNotificationDisplay(cb?: () => void) {
    ROneSignal.off("notificationDisplay", function (event) {
      cb?.();
      console.warn("OneSignal notification displayed:", event);
    });
  }

  /**
   * Lắng nghe thay đổi sub (nhấn chuông)
   */
  static addEventSubChange(cb: (isSub: boolean) => void) {
    ROneSignal.getSubscription(async (isEnable) => {
      cb(isEnable);
    });
  }

  static async checkIsSubscription() {
    return new Promise((resolve) => {
      ROneSignal.getSubscription(async (isEnable) => {
        if (isEnable) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  static async getId() {
    return new Promise((resolve) => {
      ROneSignal.getSubscription(async (isEnable) => {
        if (isEnable) {
          const oneSignalId = await ROneSignal.getUserId();
          if (oneSignalId) {
            localStorage.setItem("oneSignalId", oneSignalId);
          }

          resolve(oneSignalId);
        } else {
          localStorage.setItem("oneSignalId", "");
          resolve("");
        }
      });
    });
  }
}

// const oneSignalV2 = new OneSignal();

// export default oneSignalV2;
