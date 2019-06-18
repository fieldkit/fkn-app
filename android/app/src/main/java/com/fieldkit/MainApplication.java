package com.fieldkit;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.horcrux.svg.SvgPackage;
import com.reactlibrary.RNWifiPackage;
import com.chirag.RNMail.RNMail;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.mapbox.rctmgl.RCTMGLPackage;

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
            new NetInfoPackage(),
            new KCKeepAwakePackage(),
            new RNI18nPackage(),
            new SvgPackage(),
            new RNWifiPackage(),
            new RNMail(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNFSPackage(),
            new RNLanguagesPackage(),
            new RCTMGLPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
