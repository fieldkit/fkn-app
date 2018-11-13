package com.fieldkit;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactlibrary.RNWifiPackage;
import com.tradle.react.UdpSocketsModule;
import com.horcrux.svg.SvgPackage;
import com.chirag.RNMail.RNMail;
import com.rnfs.RNFSPackage;
import com.peel.react.TcpSocketsModule;
import org.conservify.react.ServiceDiscoveryModule;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceInfo(),
            new RNWifiPackage(),
            new UdpSocketsModule(),
            new SvgPackage(),
            new RNMail(),
            new RNFSPackage(),
            new TcpSocketsModule(),
            new ServiceDiscoveryModule()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  /*
  @Override
  protected String getJSMainModuleName() {
    return "index";
  }
  */

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
