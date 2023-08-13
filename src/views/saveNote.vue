<template>
    <div class="container mt-4">
        <div class="row mt-4">
            <div class="col-md-6 offset-md-3">
                <h2 class="text-center">Saved Notes</h2>
                <div class="note-card p-3 my-2">
                    <h5>Note Title</h5>
                    <p>Note Content...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f8f8f8;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .mt-4 {
        margin-top: 4rem;
    }

    .text-center {
        text-align: center;
    }

    .form-control {
        width: 100%;
        height: 38px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    }

    textarea.form-control {
        height: auto;
        resize: vertical;
    }

    .btn {
        display: inline-block;
        margin-bottom: 0;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        border-radius: 4px;
        transition: all 0.15s ease-in-out;
    }

    .btn-light {
        color: #333;
        background-color: #f8f9fa;
        border-color: #f8f9fa;
    }

    .btn-light:hover {
        color: #333;
        background-color: #e2e6ea;
        border-color: #dae0e5;
    }

    .btn-block {
        display: block;
        width: 100%;
    }

    .row {
        margin-left: -15px;
        margin-right: -15px;
    }

    .col-md-6 {
        width: 50%;
        float: left;
        position: relative;
        min-height: 1px;
        padding-left: 15px;
        padding-right: 15px;
    }

    .offset-md-3 {
        margin-left: 25%;
    }

    .my-2 {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .note-card {
        background-color: #f8f8f8;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 10px;
    }

    .note-card h5 {
        margin-top: 0;
        margin-bottom: 5px;
    }

    .note-card p {
        margin-top: 0;
        margin-bottom: 0;
    }
</style>
