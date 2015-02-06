using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Xamarin.Forms;

namespace MxmFacebookFriendsCheck
{
	public class App : Application
	{
        public static string FacebookAccessToken;

		public App ()
		{
			// The root page of your application
            MainPage = new NavigationPage(new LoginPage())
            {
                BarBackgroundColor = Color.Red,
                BarTextColor = Color.Black
            };
          
            //MainPage = new ResultPage();
           
		}

		protected override void OnStart ()
		{
			// Handle when your app starts
		}

		protected override void OnSleep ()
		{
			// Handle when your app sleeps
		}

		protected override void OnResume ()
		{
			// Handle when your app resumes
		}
	}
}
