using System;
using System.Collections.Generic;
using System.Text;

using Xamarin.Forms;

namespace MxmFacebookFriendsCheck
{
    public class ResultPage : ContentPage
    {
        public ResultPage(){
            //Title = "Friends checker";

            this.Content = new StackLayout
            {
                Orientation = StackOrientation.Vertical,
                Children = {
                    new StackLayout {
                        Orientation =  StackOrientation.Horizontal,
                        Children = 
                        {
                            new Label {FontSize=40, Text = "0",
                                VerticalOptions = LayoutOptions.CenterAndExpand,
                                HorizontalOptions = LayoutOptions.CenterAndExpand
                            },
                            new Label {FontSize=40, Text = "/",
                                VerticalOptions = LayoutOptions.CenterAndExpand,
                                HorizontalOptions = LayoutOptions.CenterAndExpand
                            },
                            new Label {FontSize=40, Text = "15",
                                VerticalOptions = LayoutOptions.CenterAndExpand,
                                HorizontalOptions = LayoutOptions.CenterAndExpand
                            },
                        }
                    },
                    new Label {FontSize=40, BackgroundColor=Color.Red, Text = "0%",
                                VerticalOptions = LayoutOptions.CenterAndExpand,
                                HorizontalOptions = LayoutOptions.CenterAndExpand}
                }
            };
        }
    }
}
