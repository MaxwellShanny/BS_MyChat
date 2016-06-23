//
//  ViewController.swift
//  mobile
//
//  Created by maxwell on 16/6/21.
//  Copyright © 2016年 maxwell. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var webview: UIWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        var url = NSURL(string: "http://127.0.0.1:3000");
        var request = NSURLRequest(URL: url!);
        webview.loadRequest(request);
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

