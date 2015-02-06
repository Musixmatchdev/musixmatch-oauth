using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

using Xamarin.Auth;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Net;
using MxmFacebookFriendsCheck;
using MxmFacebookFriendsCheck.Droid;
using System.Net.Http;
using System.Threading.Tasks;

[assembly: ExportRenderer(typeof(LoginPage), typeof(LoginPageRenderer))]

namespace MxmFacebookFriendsCheck.Droid
{

        public class LoginPageRenderer : PageRenderer
        {
            bool done = false;
         
            static OAuth2Authenticator auth;

            protected override void OnElementChanged(ElementChangedEventArgs<Page> e)
            {
                base.OnElementChanged(e);

                if (!done)
                {

                    // this is a ViewGroup - so should be able to load an AXML file and FindView<>
                    var activity = this.Context as Activity;
                    /* 
                    auth = new OAuth2Authenticator(
                        clientId: "131314396964274",
                        //clientSecret: "5e597f38b09776840d416d9d27ee0196",
                        scope: "",
                        authorizeUrl: new Uri("https://m.facebook.com/dialog/oauth/"),
                        redirectUrl: new Uri("https://apic.musixmatch.com/fb/callback")//,
                       // accessTokenUrl: new Uri("https://accounts.google.com/o/oauth2/token"),
                       // getUsernameAsync: null
                        ); 
                     * */

                    auth = new OAuth2Authenticator(
                        clientId: "mac-ios-v2.0",
                        clientSecret: "supersecret",
                        scope: "ALL",
                        authorizeUrl: new Uri("http://apic.musixmatch.com/oauth/authorize"),
                        redirectUrl: new Uri("http://apic.musixmatch.com/robots.txt?"),
                        accessTokenUrl: new Uri("http://apic.musixmatch.com/oauth/token")
                    ); 


                    auth.ClearCookiesBeforeLogin = true;
                    auth.Title = "mxm oauth login";
                    auth.Error += auth_Error;

                    auth.Completed += (sender, eventArgs) => {
                        if (eventArgs.IsAuthenticated)
                        {
                            App.FacebookAccessToken = "";
                            eventArgs.Account.Properties.TryGetValue("access_token", out App.FacebookAccessToken);

                            HttpClient hc = new HttpClient();
                            Uri u = new Uri("https://oauth.musixmatch.com/ws/1.1/user.get?app_id=mac-ios-v2.0&usertoken=" + App.FacebookAccessToken);
                            var r = hc.GetAsync(u);
                            r.Wait();
                          
                            if (!r.Result.IsSuccessStatusCode)
                                Console.WriteLine("Error: " + r.Exception.InnerException.Message);
                            else
                            {
                                var json = r.Result.Content.ReadAsStringAsync();
                                json.Wait();
                                Console.WriteLine(json.Result);

                                App.Current.MainPage = new MxmFacebookFriendsCheck.ResultPage()
                                {
                                    // BarBackgroundColor = Color.Red,
                                    // BarTextColor = Color.Black
                                };
                            }
                          


                            /*var request = new OAuth2Request("GET", new Uri("https://graph.facebook.com/me"), null, eventArgs.Account);
                            request.GetResponseAsync().ContinueWith(t =>
                            {
                                if (t.IsFaulted)
                                    Console.WriteLine("Error: " + t.Exception.InnerException.Message);
                                else
                                {
                                    string json = t.Result.GetResponseText();
                                    Console.WriteLine(json);

                                    App.FacebookAccount = eventArgs.Account;
                                }
                            });*/
                        }
                        else
                        {
                            // The user cancelled
                        }
                    };

                    activity.StartActivity(auth.GetUI(activity.Application.ApplicationContext));
                    done = true;
                }
            }

            void auth_Error(object sender, AuthenticatorErrorEventArgs e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
            }

            
        }

}